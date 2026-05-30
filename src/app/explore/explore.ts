import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';
import { SearchBar } from '../search-bar/search-bar';
import { BookService, Book } from '../book'; 

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [Layout, SearchBar, FormsModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class Explore implements OnInit {
  books: Book[] = []; // La lista original completa
  filteredBooks: Book[] = []; // La lista filtrada que se muestra en pantalla

  newTitle: string = '';
  newAuthor: string = '';
  newCategory: string = 'Ficción';

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  // --- MÉTODOS ACTUALIZADOS PARA LA API (ASÍNCRONOS) ---

  loadBooks() {
    // Nos suscribimos al Observable que devuelve el backend
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        // Al cargar, la lista filtrada es igual a la original que llegó de Django
        this.filteredBooks = [...this.books]; 
      },
      error: (err) => {
        console.error('Error al cargar los libros desde el servidor:', err);
      }
    });
  }

  onDelete(id: string | number | undefined) {
    // Si por alguna razón el libro no tiene ID, detenemos la función aquí
    if (id === undefined) {
      return; 
    }

    // Mandamos la petición DELETE y esperamos la confirmación antes de recargar
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.loadBooks(); 
      },
      error: (err) => {
        console.error('Error al intentar borrar el libro:', err);
      }
    });
  }

  onAddBook() {
    if (this.newTitle.trim() === '' || this.newAuthor.trim() === '') {
      return;
    }

    const newBookData = {
      title: this.newTitle,
      author: this.newAuthor,
      category: this.newCategory,
      status: 'Pendiente'
    };

    // Mandamos la petición POST y esperamos a que Django lo guarde en MySQL
    this.bookService.addBook(newBookData).subscribe({
      next: () => {
        // Limpiamos el formulario SOLO si el backend respondió con éxito
        this.newTitle = '';
        this.newAuthor = '';
        this.newCategory = 'Ficción';
        
        // Volvemos a pedir la lista actualizada
        this.loadBooks();
      },
      error: (err) => {
        console.error('Error al intentar guardar el libro:', err);
      }
    });
  }

  // ¡NUEVO! Método para cambiar el estado del libro (Pendiente <-> Leído)
  onToggleStatus(book: Book) {
    if (book.id === undefined) {
      return;
    }

    // Cambiamos el estado dependiendo de cuál tenga actualmente
    const newStatus = book.status === 'Pendiente' ? 'Leído' : 'Pendiente';

    // Enviamos solo el campo 'status' modificado al endpoint PUT de Django
    this.bookService.updateBook(book.id, { status: newStatus }).subscribe({
      next: () => {
        // Si el backend lo actualizó correctamente en MySQL, recargamos la lista
        this.loadBooks();
      },
      error: (err) => {
        console.error('Error al intentar cambiar el estado del libro:', err);
      }
    });
  }

  // El filtrado de búsqueda es instantáneo sobre los datos que ya descargamos
  onSearch(searchTerm: string) {
    const term = searchTerm.toLowerCase(); 
    
    this.filteredBooks = this.books.filter(book => 
      book.title.toLowerCase().includes(term) || 
      book.author.toLowerCase().includes(term)
    );
  }
}